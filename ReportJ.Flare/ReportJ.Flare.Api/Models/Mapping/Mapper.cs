﻿using AutoMapper;
using ReportJ.Flare.Repo.Entities;
using System.Collections.Generic;

namespace ReportJ.Flare.Api.Models.Mapping
{
    public static class Mapper
    {
        private readonly static IConfigurationProvider _config;
        private static IMapper _mapper;

        static Mapper()
        {
            _config = new MapperConfiguration(cfg => cfg.AddProfile<GeneralMappingProfile>());
            _mapper = _config.CreateMapper();
        }

        public static CommitModel ToModel(this Commit commit)
        {
            return _mapper.Map<Commit, CommitModel>(commit);
        }

        public static IEnumerable<CommitModel> ToModel(this IEnumerable<Commit> commits)
        {
            return _mapper.Map<IEnumerable<Commit>, IEnumerable<CommitModel>>(commits);
        }
    }
}