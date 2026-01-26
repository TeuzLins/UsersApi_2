using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UsersApi.Api.Models;

namespace UsersApi.Api.Data;

public static class SeedData
{
    public static async Task InitializeAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var hasher = new PasswordHasher<User>();

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Name = "Admin",
            Email = "admin@usersapi.com",
            Role = "ADMIN",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Admin@123");

        var manager = new User
        {
            Id = Guid.NewGuid(),
            Name = "Manager",
            Email = "manager@usersapi.com",
            Role = "MANAGER",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        manager.PasswordHash = hasher.HashPassword(manager, "Manager@123");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = "User",
            Email = "user@usersapi.com",
            Role = "USER",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        user.PasswordHash = hasher.HashPassword(user, "User@123");

        context.Users.AddRange(admin, manager, user);
        await context.SaveChangesAsync();
    }
}
