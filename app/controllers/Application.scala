package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.JsValue
import play.api.libs.json.JsObject
import play.api.libs.json.JsNumber
import play.api.libs.json.JsArray
import play.api.libs.json.JsString
import play.api.libs.json.JsNull

object Application extends Controller {

  val field = Array.ofDim[Int](3, 3)

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def test = Action {
    Ok(views.html.test(0))
  }

  def test2 = Action {
    Ok(views.html.test(1))
  }

  def enter = Action {
    Ok(views.html.enter())
  }

  def put(x: Int, y: Int, turn: Int) = Action {
    field(x)(y) = 1
    Ok("x=" + x + ", y=" + y)
  }

  def get = Action {
    val obj = JsObject(
      "0" -> JsNumber(field(0)(0)) ::
        "1" -> JsNumber(field(0)(1)) ::
        "2" -> JsNumber(field(0)(2)) ::
        "3" -> JsNumber(field(1)(0)) ::
        "4" -> JsNumber(field(1)(1)) ::
        "5" -> JsNumber(field(1)(2)) ::
        "6" -> JsNumber(field(2)(0)) ::
        "7" -> JsNumber(field(2)(1)) ::
        "8" -> JsNumber(field(2)(2)) ::
        Nil)
    Ok(obj);
  }

  def reset = Action {
    for (x <- Range(0, 3)) {
      for (y <- Range(0, 3)) {
        field(x)(y) = 0
      }
    }
    Ok("reset")
  }

}