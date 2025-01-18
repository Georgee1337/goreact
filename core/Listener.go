package core

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

func Listen() {
	engine := html.New("./assets/webpack", ".template")

	app := fiber.New(fiber.Config{
		Views:                 engine,
		DisableStartupMessage: true,
	})

	app.Static("/assets", "./assets/webpack/public")

	visinomala := []string{
		"/",
	}

	for _, route := range visinomala {
		app.Get(route, homeController)
	}

	app.Get("/reload", func(c *fiber.Ctx) error {
		engine.Reload(true)
		return c.SendString("Engine reloaded")
	})

	if err := app.Listen(":3000"); err != nil {
		panic(err)
	}
}

func homeController(c *fiber.Ctx) error {
	return c.Render("index", fiber.Map{})
}
