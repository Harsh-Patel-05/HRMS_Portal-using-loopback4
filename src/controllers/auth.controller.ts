import {
  repository,
} from '@loopback/repository';
import {post, requestBody, response} from '@loopback/rest';
import {UserCredentialsRepository, UserRepository} from '../repositories';
import {genSalt, hash} from 'bcryptjs';
import {UserService} from '../services';
import {service} from '@loopback/core';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @service(UserService)
    public userService: UserService,
  ) { }

  //Sign up API Endpoint
  @post('/auth/sign-up', {
    summary: 'Sign up API Endpoint',
    responses: {
      '200': {},
    },
  })
  async signup(
    @requestBody({
      description: 'Sign up API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
              },
              password: {
                type: 'string',
                minLength: 8,
              },
            },
          },
        },
      },
    })
    payload: {
      email: string;
      password: string;
    },
  ) {
    const {email, password} = payload;
    const user = await this.userRepository.create({
      email
    })
    const hashpassword = await hash(password, await genSalt())
    await this.userCredentialsRepository.create({
      userId: user.id,
      password: hashpassword
    });
    return user
  }

  //Login API Endpoint
  @post('/auth/login', {
    summary: 'Login API Endpoint',
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                otp: {
                  type: 'number',
                },
                otpReference: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      description: 'Login API Endpoint',
      content: {
        'application/json': {
          schema: {
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                maxLength: 254,
                minLength: 5,
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: `Invalid input.`,
                },
              },
              password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: `Invalid input.`,
                },
              },
            },
          },
        },
      },
    })
    payload: {
      email: string;
      password: string;
    },
  ){
    const user = await this.userService.verifyCredentials(payload);
    if(user){
      return {
        statusCode: 404,
        message: 'user creted successfully'
      }
    }

    return {
      statusCode: 404,
      message: 'user not found'
    }
  }
}
