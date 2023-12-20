package models
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends Tables {
  val profile = slick.jdbc.PostgresProfile
}

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.jdbc.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema: profile.SchemaDescription = Directmessages.schema ++ Items.schema ++ Users.schema
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table Directmessages
   *  @param msgId Database column msg_id SqlType(serial), AutoInc, PrimaryKey
   *  @param senderId Database column sender_id SqlType(int4)
   *  @param receiverId Database column receiver_id SqlType(int4)
   *  @param timestamp Database column timestamp SqlType(varchar), Length(200,true)
   *  @param text Database column text SqlType(varchar), Length(2000,true) */
  case class DirectmessagesRow(msgId: Int, senderId: Int, receiverId: Int, timestamp: String, text: String)
  /** GetResult implicit for fetching DirectmessagesRow objects using plain SQL queries */
  implicit def GetResultDirectmessagesRow(implicit e0: GR[Int], e1: GR[String]): GR[DirectmessagesRow] = GR{
    prs => import prs._
    DirectmessagesRow.tupled((<<[Int], <<[Int], <<[Int], <<[String], <<[String]))
  }
  /** Table description of table directmessages. Objects of this class serve as prototypes for rows in queries. */
  class Directmessages(_tableTag: Tag) extends profile.api.Table[DirectmessagesRow](_tableTag, "directmessages") {
    def * = (msgId, senderId, receiverId, timestamp, text).<>(DirectmessagesRow.tupled, DirectmessagesRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(msgId), Rep.Some(senderId), Rep.Some(receiverId), Rep.Some(timestamp), Rep.Some(text))).shaped.<>({r=>import r._; _1.map(_=> DirectmessagesRow.tupled((_1.get, _2.get, _3.get, _4.get, _5.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column msg_id SqlType(serial), AutoInc, PrimaryKey */
    val msgId: Rep[Int] = column[Int]("msg_id", O.AutoInc, O.PrimaryKey)
    /** Database column sender_id SqlType(int4) */
    val senderId: Rep[Int] = column[Int]("sender_id")
    /** Database column receiver_id SqlType(int4) */
    val receiverId: Rep[Int] = column[Int]("receiver_id")
    /** Database column timestamp SqlType(varchar), Length(200,true) */
    val timestamp: Rep[String] = column[String]("timestamp", O.Length(200,varying=true))
    /** Database column text SqlType(varchar), Length(2000,true) */
    val text: Rep[String] = column[String]("text", O.Length(2000,varying=true))

    /** Foreign key referencing Users (database name directmessages_receiver_id_fkey) */
    lazy val usersFk1 = foreignKey("directmessages_receiver_id_fkey", receiverId, Users)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.Cascade)
    /** Foreign key referencing Users (database name directmessages_sender_id_fkey) */
    lazy val usersFk2 = foreignKey("directmessages_sender_id_fkey", senderId, Users)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table Directmessages */
  lazy val Directmessages = new TableQuery(tag => new Directmessages(tag))

  /** Entity class storing rows of table Items
   *  @param itemId Database column item_id SqlType(serial), AutoInc, PrimaryKey
   *  @param userId Database column user_id SqlType(int4)
   *  @param text Database column text SqlType(varchar), Length(2000,true) */
  case class ItemsRow(itemId: Int, userId: Int, text: String)
  /** GetResult implicit for fetching ItemsRow objects using plain SQL queries */
  implicit def GetResultItemsRow(implicit e0: GR[Int], e1: GR[String]): GR[ItemsRow] = GR{
    prs => import prs._
    ItemsRow.tupled((<<[Int], <<[Int], <<[String]))
  }
  /** Table description of table items. Objects of this class serve as prototypes for rows in queries. */
  class Items(_tableTag: Tag) extends profile.api.Table[ItemsRow](_tableTag, "items") {
    def * = (itemId, userId, text).<>(ItemsRow.tupled, ItemsRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(itemId), Rep.Some(userId), Rep.Some(text))).shaped.<>({r=>import r._; _1.map(_=> ItemsRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column item_id SqlType(serial), AutoInc, PrimaryKey */
    val itemId: Rep[Int] = column[Int]("item_id", O.AutoInc, O.PrimaryKey)
    /** Database column user_id SqlType(int4) */
    val userId: Rep[Int] = column[Int]("user_id")
    /** Database column text SqlType(varchar), Length(2000,true) */
    val text: Rep[String] = column[String]("text", O.Length(2000,varying=true))

    /** Foreign key referencing Users (database name items_user_id_fkey) */
    lazy val usersFk = foreignKey("items_user_id_fkey", userId, Users)(r => r.id, onUpdate=ForeignKeyAction.NoAction, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table Items */
  lazy val Items = new TableQuery(tag => new Items(tag))

  /** Entity class storing rows of table Users
   *  @param id Database column id SqlType(serial), AutoInc, PrimaryKey
   *  @param username Database column username SqlType(varchar), Length(20,true)
   *  @param password Database column password SqlType(varchar), Length(200,true) */
  case class UsersRow(id: Int, username: String, password: String)
  /** GetResult implicit for fetching UsersRow objects using plain SQL queries */
  implicit def GetResultUsersRow(implicit e0: GR[Int], e1: GR[String]): GR[UsersRow] = GR{
    prs => import prs._
    UsersRow.tupled((<<[Int], <<[String], <<[String]))
  }
  /** Table description of table users. Objects of this class serve as prototypes for rows in queries. */
  class Users(_tableTag: Tag) extends profile.api.Table[UsersRow](_tableTag, "users") {
    def * = (id, username, password).<>(UsersRow.tupled, UsersRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = ((Rep.Some(id), Rep.Some(username), Rep.Some(password))).shaped.<>({r=>import r._; _1.map(_=> UsersRow.tupled((_1.get, _2.get, _3.get)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column id SqlType(serial), AutoInc, PrimaryKey */
    val id: Rep[Int] = column[Int]("id", O.AutoInc, O.PrimaryKey)
    /** Database column username SqlType(varchar), Length(20,true) */
    val username: Rep[String] = column[String]("username", O.Length(20,varying=true))
    /** Database column password SqlType(varchar), Length(200,true) */
    val password: Rep[String] = column[String]("password", O.Length(200,varying=true))
  }
  /** Collection-like TableQuery object for table Users */
  lazy val Users = new TableQuery(tag => new Users(tag))
}
