using AutoMapper;
using UsersApi.Api.DTOs;
using UsersApi.Api.Models;

namespace UsersApi.Api.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
    }
}
