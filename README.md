# LightKite

A lightweight, minimalistic library to simplify the creation of RESTful APIs using decorators in Node.js. Inspired by frameworks like NestJS, **LightKite** provides a clean and OOP-driven approach to building APIs.

## Features

- **Decorator-based Syntax**: Use decorators like `@Controller`, `@Get`, and `@Post` for defining routes.
- **Dynamic Route Registration**: Easily manage routes programmatically.
- **Lightweight & Flexible**: Designed for simplicity without heavy dependencies.
- **TypeScript Support**: Built-in compatibility with TypeScript for type safety.

## Installation

Install the package via NPM:

``` bash
 npm install light-kite
```

Or using Yarn:

``` bash
 yarn add light-kite
```

## Getting Started

### Example

Create a basic API with `LightKite`:

``` typescript
import { lightKiteServer, Controller, Get, Post, Body } from 'kite';

@Controller('/api')
class ApiController {
  @Get('hello')
  sayHello() {
    return { message: 'Hello, World!' };
  }

  @Post('data')
  receiveData(@Body() body: any) {
    return { received: body };
  }
}

const app = lightKiteServer({
  controllers: [ApiController],
});

app.run(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit changes: `git commit -m 'Add your feature'`.
4. Push to your branch: `git push origin feature/your-feature`.
5. Submit a pull request.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.


## Support

For issues, feature requests, or questions, visit the [GitHub Issues](https://github.com/sashakypinko/ichgram-core/issues) page.nements!