package models

object CodeGen extends App {
    slick.codegen.SourceCodeGenerator.run(
        "slick.jdbc.PostgresProfile",
        "org.postgresql.Driver",
        "jdbc:postgresql://localhost/charger?user=charger&password=0862130",
        "./server/app",
        "models", None, None, true, false
    )
}