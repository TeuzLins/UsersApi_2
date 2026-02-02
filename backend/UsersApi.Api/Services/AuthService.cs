using AutoMapper;
using Microsoft.AspNetCore.Identity;
using UsersApi.Api.DTOs;
using UsersApi.Api.Exceptions;
using UsersApi.Api.Models;
using UsersApi.Api.Repositories;

namespace UsersApi.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, bool allowRoleSelection);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshAsync(RefreshRequest request);
    Task LogoutAsync(string refreshToken);
    Task<UserDto> GetMeAsync(Guid userId);
}

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher = new();

    public AuthService(
        IUserRepository userRepository,
        IRefreshTokenRepository refreshTokenRepository,
        ITokenService tokenService,
        IMapper mapper)
    {
        _userRepository = userRepository;
        _refreshTokenRepository = refreshTokenRepository;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, bool allowRoleSelection)
    {
        var existing = await _userRepository.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            throw new AppException("Email já cadastrado.", 400);
        }

        var role = allowRoleSelection && !string.IsNullOrWhiteSpace(request.Role)
            ? request.Role!.ToUpperInvariant()
            : "USER";

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email.ToLowerInvariant(),
            Role = role,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _hasher.HashPassword(user, request.Password);

        await _userRepository.AddAsync(user);

        return await BuildAuthResponseAsync(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email.ToLowerInvariant());
        if (user == null)
        {
            throw new AppException("Credenciais inválidas.", 401);
        }

        if (!user.IsActive)
        {
            throw new AppException("Usuário inativo.", 403);
        }

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            throw new AppException("Credenciais inválidas.", 401);
        }

        return await BuildAuthResponseAsync(user);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshRequest request)
    {
        var stored = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken);
        if (stored == null || !stored.IsActive)
        {
            throw new AppException("Refresh token inválido.", 401);
        }

        var user = stored.User ?? throw new AppException("Usuário não encontrado.", 404);
        if (!user.IsActive)
        {
            throw new AppException("Usuário inativo.", 403);
        }

        stored.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepository.UpdateAsync(stored);

        return await BuildAuthResponseAsync(user);
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var stored = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
        if (stored == null)
        {
            return;
        }

        stored.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepository.UpdateAsync(stored);
    }

    public async Task<UserDto> GetMeAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new AppException("Usuário não encontrado.", 404);
        }

        return _mapper.Map<UserDto>(user);
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(User user)
    {
        var accessToken = _tokenService.GenerateAccessToken(user);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refresh = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshToken,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = _tokenService.GetRefreshTokenExpiry()
        };

        await _refreshTokenRepository.AddAsync(refresh);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = _tokenService.GetAccessTokenExpiry(),
            User = _mapper.Map<UserDto>(user)
        };
    }
}
