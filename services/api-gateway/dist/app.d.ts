declare const app: import("express-serve-static-core").Express;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
declare const wss: import("ws").Server<typeof import("ws"), typeof import("http").IncomingMessage>;
export { app, server, wss };
//# sourceMappingURL=app.d.ts.map