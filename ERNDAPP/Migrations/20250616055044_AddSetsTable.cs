using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ERNDAPP.Migrations
{
    /// <inheritdoc />
    public partial class AddSetsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Set_Exercises_ExerciseId",
                table: "Set");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Set",
                table: "Set");

            migrationBuilder.RenameTable(
                name: "Set",
                newName: "Sets");

            migrationBuilder.RenameColumn(
                name: "weight",
                table: "Sets",
                newName: "Weight");

            migrationBuilder.RenameIndex(
                name: "IX_Set_ExerciseId",
                table: "Sets",
                newName: "IX_Sets_ExerciseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Sets",
                table: "Sets",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Sets_Exercises_ExerciseId",
                table: "Sets",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sets_Exercises_ExerciseId",
                table: "Sets");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Sets",
                table: "Sets");

            migrationBuilder.RenameTable(
                name: "Sets",
                newName: "Set");

            migrationBuilder.RenameColumn(
                name: "Weight",
                table: "Set",
                newName: "weight");

            migrationBuilder.RenameIndex(
                name: "IX_Sets_ExerciseId",
                table: "Set",
                newName: "IX_Set_ExerciseId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Set",
                table: "Set",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Set_Exercises_ExerciseId",
                table: "Set",
                column: "ExerciseId",
                principalTable: "Exercises",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
