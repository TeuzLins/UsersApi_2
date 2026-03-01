using System.ComponentModel.DataAnnotations;

namespace UsersApi.Api.DTOs;

public record RegisterRequest
{
    [Required]
    [MaxLength(120)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    public string? Role { get; init; }
}

