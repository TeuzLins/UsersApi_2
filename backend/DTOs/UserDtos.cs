using System.ComponentModel.DataAnnotations;

namespace UsersApi.Api.DTOs;

public record UserDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public bool IsActive { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}

public record CreateUserRequest
{
    [Required]
    [MaxLength(120)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string Role { get; init; } = "USER";
}

public record UpdateUserRequest
{
    [MaxLength(120)]
    public string? Name { get; init; }

    [EmailAddress]
    public string? Email { get; init; }

    public string? Role { get; init; }
}

public record UpdateUserStatusRequest
{
    public bool IsActive { get; init; }
}

public record PagedResult<T>
{
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
    public List<T> Items { get; init; } = new();
}
