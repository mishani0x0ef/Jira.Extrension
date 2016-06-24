﻿using AutoMapper;
using ReportJ.Flare.Repo.Entities;
using SharpSvn;

namespace ReportJ.Flare.Repo.Services.Mapping
{
    internal class GeneralMappingProfile : Profile
    {
        protected override void Configure()
        {
            CreateMap<SvnLogEventArgs, Commit>()
                .ForMember(c => c.CommitId, e => e.MapFrom(x => x.Revision))
                .ForMember(c => c.Message, e => e.MapFrom(x => x.LogMessage))
                .ForMember(c => c.Date, e => e.MapFrom(x => x.Time));
        }
    }
}