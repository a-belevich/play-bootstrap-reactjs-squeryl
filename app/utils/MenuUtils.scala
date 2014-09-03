package util

object Align extends Enumeration {
  type Align = Value
  val Left, Right = Value
}
import Align._

abstract sealed trait MenuItem  {
  val isActive = false
  def active(className: String) = if (isActive) className + " " else ""
}

abstract sealed trait MainMenuItem extends MenuItem {
  val align: Align = Left
  def isAligned(to: Align) = (align == to)
}
case class MainMenuAction(url: String, text: String, override val isActive: Boolean, override val align: Align) extends MainMenuItem
case class MainMenuDropdown(text: String, override val isActive: Boolean, override val align: Align, items: Seq[SubMenuItem]) extends MainMenuItem

abstract sealed class SubMenuItem extends MenuItem
case class SubMenuDivider() extends SubMenuItem
case class SubMenuAction(url: String, text: String, override val isActive: Boolean) extends SubMenuItem
