import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import expressSanitizer from 'express-sanitizer'
import { port, corsOptions, host } from './config.js'

// ErrorHandling
import 'express-async-errors'

// Routes
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import boardRoutes from './routes/board.js'
import todosRoutes from './routes/todos.js'

// Controllers
import { authenticate, set_user } from './services/auth_services.js'

// Middlewares
import errorMiddleware from './middlewares/error_middleware.js'
import acceptsFormatMiddleware from './middlewares/accepts_format_middleware.js'
import setContentType from './middlewares/set_content_type.js'

// Helpers
import { non_existent_route } from './helpers/non_existent_route.js'

// dotEnv Config
dotenv.config()

// Server
const app = express()

// body-parser -> From Express 4.16+
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.text())
app.use(cookieParser())

// Request Accepts HTML
app.use(acceptsFormatMiddleware)

// express-sanitizer middleware
app.use(expressSanitizer())

// Sets Content-Type header
app.use(setContentType)

// Public Folder
app.use(express.static('public'))

// App Routes
app.use('/auth', authRoutes)
app.use('/users', authenticate, set_user, usersRoutes)
app.use('/boards', authenticate, set_user, boardRoutes)
app.use('/todos', authenticate, set_user, todosRoutes)

// Redirect to 404 Page
app.get("*", non_existent_route)

// Error Handler
app.use(errorMiddleware)

// Server Running
app.listen(port, _ => console.log(`Server Running at: http://${host}:${port}/`))
