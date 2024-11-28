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
import { lightKiteServer, Controller, Get, Post, Body } from 'light-kite';

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

### Services

Provide the services in the "services" property when creating a LightKite instance and inject it as dependency wherever needed.
You can also implement dependency inversion by passing an object with this structure instead of a class as the service.
This allows you to swap the implementation when necessary and isolates your business logic from the details of
the infrastructure, making the system more flexible and easier to test:

``` typescript
import { lightKiteServer, Controller, Get, Inject, Injectable } from 'light-kite';

const TYPES = {
  AppService: Symbol.for('AppService'),
  ILogger: Symbol.for('ILogger'),
};

interface ILogger {
  log(message: string): void;
}

@Injectable()
class CliLogger implements ILogger {
  log(message: string) {
    console.log(message);
  }
}

@Injectable()
class AppService {
  constructor(@Inject(TYPES.ILogger) private readonly logger: ILogger) {}
  
  sayHello() {
    this.logger.log('I said hello');
    
    return 'Hello, World!';
  }
}

@Controller('/api')
class ApiController {
  constructor(@Inject(TYPES.AppService) private readonly appService: AppService) {}

  @Get('hello')
  sayHello() {
    return this.appService.sayHello();
  }
}

const app = lightKiteServer({
  controllers: [ApiController],
  services: [
    AppService,
    { Service: CliLogger, TypeSymbol: TYPES.ILogger }
  ],
});

app.run(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Middlewares

Provide the middlewares:

``` typescript
import { lightKiteServer, Controller, Get } from 'light-kite';
import { Request, Response, NextFunction } from 'express';

@Controller('/api')
class ApiController {
  @Get('hello')
  sayHello() {
    return 'Hello world!';
  }
}

const someMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // do something
  next();
};


const app = lightKiteServer({
  middlewares: [someMiddleware],
  controllers: [ApiController],
});

app.run(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### Validation

Use the `class-validator` package to set validation rules in the DTO class, and by using the @ValidateDto decorator 
and passing the created DTO class into it, validate your requests:

``` typescript
import { lightKiteServer, Controller, Get, Body, ValidateDto } from 'light-kite';
import {Length, IsNotEmpty} from 'class-validator';

class SayHelloDto {
  @IsNotEmpty({message: 'Name is required'})
  @Length(2, 12, {message: 'Name must be between 2 and 12 characters'})
  name: string;
}

@Controller('/api')
class ApiController {
  
  @ValidateDto(SayHelloDto)
  @Get('hello')
  sayHello(@Body() { name }: SayHelloDto) {
    return `Hello, ${name}`; 
  }
}

const app = lightKiteServer({
  controllers: [ApiController],
});

app.run(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
```

### WebSockets

You can easily set up WebSockets by using the useUserSocket method, 
and then inject the userConnections object into the necessary endpoints:

``` typescript
import { lightKiteServer, Controller, Get, UserConnections, UserConnectionsType } from 'light-kite';

@Controller('/api')
class ApiController {
  @Get('hello')
  sayHello(@UserConnections() userConnections: UserConnectionsType) {
    for (const userConnection of userConnections) {
      if (userConnection?.connected) {
        userConnection.emit('event', 'Hello world!');
      }
    }
    
    return 'Hello world!'; 
  }
}

const app = lightKiteServer({
  controllers: [ApiController],
});

app.useUserSocket('secret_key', {
  cors: {
    origin: '*',
  },
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

For issues, feature requests, or questions, visit the [GitHub Issues](https://github.com/sashakypinko/ichgram-core/issues) page.