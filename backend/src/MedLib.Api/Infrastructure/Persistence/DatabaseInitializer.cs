using MedLib.Api.Features.Resources.Controllers;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static void EnsureTablesCreated(WebApplication app)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MedLibDbContext>();

            context.Database.ExecuteSqlRaw("ALTER TABLE t_tutorial_recurso DROP COLUMN IF EXISTS titulo_video;");

            var dirtyTutorials = context.TutorialesRecursos.ToList();
            var hasChanges = false;
            foreach (var t in dirtyTutorials)
            {
                var clean = AdminResourcesController.ExtractYouTubeVideoId(t.YoutubeVideoId);
                if (!string.IsNullOrEmpty(clean) && clean != t.YoutubeVideoId)
                {
                    t.YoutubeVideoId = clean;
                    hasChanges = true;
                }
            }
            if (hasChanges)
            {
                context.SaveChanges();
            }
        }
        catch
        {
        }
    }
}
