using MedLib.Api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MedLib.Api.Infrastructure.Persistence;

public class MedLibDbContext : DbContext
{
    public MedLibDbContext(DbContextOptions<MedLibDbContext> options) : base(options)
    {
    }

    public DbSet<BaseDatosMedica> BasesDatosMedicas => Set<BaseDatosMedica>();
    public DbSet<Materia> Materias => Set<Materia>();
    public DbSet<BaseRelacionMateria> BasesRelacionesMaterias => Set<BaseRelacionMateria>();
    public DbSet<TutorialRecurso> TutorialesRecursos => Set<TutorialRecurso>();
    public DbSet<UsuarioAdmin> UsuariosAdmin => Set<UsuarioAdmin>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<BaseDatosMedica>(entidad =>
        {
            entidad.ToTable("t_base_datos_medica");
            entidad.HasKey(e => e.IdBaseDatos);
            entidad.Property(e => e.IdBaseDatos).HasColumnName("id_base_datos").ValueGeneratedOnAdd();
            entidad.Property(e => e.NombreRecurso).HasColumnName("nombre_recurso").HasMaxLength(100).IsRequired();
            entidad.Property(e => e.LogotipoUrl).HasColumnName("logotipo_url").HasMaxLength(255).IsRequired();
            entidad.Property(e => e.DescripcionClinica).HasColumnName("descripcion_clinica").IsRequired();
            entidad.Property(e => e.EsSuscripcion).HasColumnName("es_suscripcion").HasDefaultValue(true);
            entidad.Property(e => e.TieneAppMovil).HasColumnName("tiene_app_movil").HasDefaultValue(false);
            entidad.Property(e => e.UrlExterno).HasColumnName("url_externo").HasMaxLength(255);
            entidad.Property(e => e.EstadoActivo).HasColumnName("estado_activo").HasDefaultValue(true);
            entidad.Property(e => e.MostrarEnHexagonos).HasColumnName("mostrar_en_hexagonos").HasDefaultValue(false);

            entidad.HasOne(e => e.Tutorial)
                   .WithOne(t => t.BaseDatos)
                   .HasForeignKey<TutorialRecurso>(t => t.IdBaseDatos)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Materia>(entidad =>
        {
            entidad.ToTable("t_materia");
            entidad.HasKey(e => e.IdMateria);
            entidad.Property(e => e.IdMateria).HasColumnName("id_materia").ValueGeneratedOnAdd();
            entidad.Property(e => e.NombreMateria).HasColumnName("nombre_materia").HasMaxLength(50).IsRequired();
            entidad.HasIndex(e => e.NombreMateria).IsUnique();
        });

        modelBuilder.Entity<BaseRelacionMateria>(entidad =>
        {
            entidad.ToTable("t_base_relacion_materia");
            entidad.HasKey(e => new { e.IdBaseDatos, e.IdMateria });
            entidad.Property(e => e.IdBaseDatos).HasColumnName("id_base_datos");
            entidad.Property(e => e.IdMateria).HasColumnName("id_materia");

            entidad.HasOne(e => e.BaseDatos)
                   .WithMany(b => b.RelacionesMateria)
                   .HasForeignKey(e => e.IdBaseDatos)
                   .OnDelete(DeleteBehavior.Cascade);

            entidad.HasOne(e => e.Materia)
                   .WithMany(m => m.RelacionesMateria)
                   .HasForeignKey(e => e.IdMateria)
                   .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TutorialRecurso>(entidad =>
        {
            entidad.ToTable("t_tutorial_recurso");
            entidad.HasKey(e => e.IdTutorial);
            entidad.Property(e => e.IdTutorial).HasColumnName("id_tutorial").ValueGeneratedOnAdd();
            entidad.Property(e => e.IdBaseDatos).HasColumnName("id_base_datos").IsRequired();
            entidad.Property(e => e.YoutubeVideoId).HasColumnName("youtube_video_id").HasMaxLength(20).IsRequired();
            entidad.Property(e => e.GuiaPdfUrl).HasColumnName("guia_pdf_url").HasMaxLength(255);
        });

        modelBuilder.Entity<UsuarioAdmin>(entidad =>
        {
            entidad.ToTable("t_usuario_admin");
            entidad.HasKey(e => e.IdUsuarioAdmin);
            entidad.Property(e => e.IdUsuarioAdmin).HasColumnName("id_usuario_admin").ValueGeneratedOnAdd();
            entidad.Property(e => e.Username).HasColumnName("username").HasMaxLength(50).IsRequired();
            entidad.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entidad.Property(e => e.Nombres).HasColumnName("nombres").HasMaxLength(100).IsRequired();
            entidad.Property(e => e.Rol).HasColumnName("rol").HasMaxLength(20).HasDefaultValue("Asistente");
            entidad.Property(e => e.EstadoActivo).HasColumnName("estado_activo").HasDefaultValue(true);
            entidad.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entidad.HasIndex(e => e.Username).IsUnique();
        });

        modelBuilder.Entity<RefreshToken>(entidad =>
        {
            entidad.ToTable("t_refresh_token");
            entidad.HasKey(e => e.IdRefreshToken);
            entidad.Property(e => e.IdRefreshToken).HasColumnName("id_refresh_token").ValueGeneratedOnAdd();
            entidad.Property(e => e.IdUsuarioAdmin).HasColumnName("id_usuario_admin").IsRequired();
            entidad.Property(e => e.FamilyId).HasColumnName("family_id").IsRequired();
            entidad.Property(e => e.TokenHash).HasColumnName("token_hash").HasMaxLength(255).IsRequired();
            entidad.Property(e => e.FechaExpiracion).HasColumnName("fecha_expiracion").IsRequired();
            entidad.Property(e => e.FechaCreacion).HasColumnName("fecha_creacion").HasDefaultValueSql("CURRENT_TIMESTAMP");
            entidad.Property(e => e.CreadoPorIp).HasColumnName("creado_por_ip").HasMaxLength(50);
            entidad.Property(e => e.UserAgent).HasColumnName("user_agent").HasMaxLength(255);
            entidad.Property(e => e.Revocado).HasColumnName("revocado").HasDefaultValue(false);
            entidad.Property(e => e.FechaRevocacion).HasColumnName("fecha_revocacion");
            entidad.Property(e => e.ReemplazadoPorTokenHash).HasColumnName("reemplazado_por_token_hash").HasMaxLength(255);
            entidad.Property(e => e.MotivoRevocacion).HasColumnName("motivo_revocacion").HasMaxLength(100);

            entidad.HasIndex(e => e.TokenHash);
            entidad.HasIndex(e => e.FamilyId);
            entidad.HasIndex(e => e.IdUsuarioAdmin);

            entidad.HasOne(e => e.UsuarioAdmin)
                   .WithMany()
                   .HasForeignKey(e => e.IdUsuarioAdmin)
                   .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

