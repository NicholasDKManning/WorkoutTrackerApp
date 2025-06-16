using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERNDAPP.Migrations
{
    /// <inheritdoc />
    public partial class AddSetTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sets",
                table: "Exercises");

            migrationBuilder.CreateTable(
                name: "Set",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExerciseId = table.Column<int>(type: "int", nullable: false),
                    Reps = table.Column<int>(type: "int", nullable: false),
                    weight = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Set", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Set_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Set_ExerciseId",
                table: "Set",
                column: "ExerciseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Set");

            migrationBuilder.AddColumn<string>(
                name: "Sets",
                table: "Exercises",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
