import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import superadminRoutes from './routes/superadmin.routes';
import { notFound, errorHandler } from './middlewares/error.middleware';
import { rateLimiter } from './middlewares/rateLimit.middleware';
import helmet from 'helmet';

const app = express();

// Apply Helmet middleware for security
app.use(helmet());

// Apply rate limiting middleware globally
app.use(rateLimiter);

app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes with version prefix
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/superadmin', superadminRoutes);

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

export default app;