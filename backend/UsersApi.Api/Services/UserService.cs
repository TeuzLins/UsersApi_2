using AutoMapper;
using Microsoft.AspNetCore.Identity;
using UsersApi.Api.DTOs;
using UsersApi.Api.Exceptions;
using UsersApi.Api.Models;
using UsersApi.Api.Repositories;

namespace UsersApi.Api.Services;

public interface IUserService
{
    Task<PagedResult<UserDto>> GetPagedAsync(int page, int pageSize, string? search);
    Task<UserDto> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserRequest request);
    Task<UserDto> UpdateAsync(Guid id, UpdateUserRequest request, bool allowRoleChange);
    Task<UserDto> UpdateStatusAsync(Guid id, bool isActive);
    Task DeleteAsync(Guid id);
}

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly PasswordHasher<User> _hasher = new();

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<PagedResult<UserDto>> GetPagedAsync(int page, int pageSize, string? search)
    {
        var (items, total) = await _userRepository.GetPagedAsync(page, pageSize, search);
        return new PagedResult<UserDto>
        {
            Page = page,
            PageSize = pageSize,
            TotalCount = total,
            Items = items.Select(_mapper.Map<UserDto>).ToList()
        };
    }

    public async Task<UserDto> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new AppException("Usuário não encontrado.", 404);
        }

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request)
    {
        var existing = await _userRepository.GetByEmailAsync(request.Email);
        if (existing != null)
        {
            throw new AppException("Email já cadastrado.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email.ToLowerInvariant(),
            Role = request.Role.ToUpperInvariant(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        user.PasswordHash = _hasher.HashPassword(user, request.Password);

        await _userRepository.AddAsync(user);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> UpdateAsync(Guid id, UpdateUserRequest request, bool allowRoleChange)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new AppException("Usuário não encontrado.", 404);
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            user.Name = request.Name;
        }

        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            user.Email = request.Email.ToLowerInvariant();
        }

        if (allowRoleChange && !string.IsNullOrWhiteSpace(request.Role))
        {
            user.Role = request.Role.ToUpperInvariant();
        }

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> UpdateStatusAsync(Guid id, bool isActive)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new AppException("Usuário não encontrado.", 404);
        }

        user.IsActive = isActive;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return _mapper.Map<UserDto>(user);
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
        {
            throw new AppException("Usuário não encontrado.", 404);
        }

        await _userRepository.DeleteAsync(user);
    }
}
