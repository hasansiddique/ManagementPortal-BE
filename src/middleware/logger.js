// @desc    It will Logs the hitting request to console (alternate to npm morgan)
const logger = (ctx, next) => {
  // eslint-disable-next-line no-console
  console.log(
        `${ctx.request.method} ${ctx.request.protocol}://${ctx.request.get('host')}${ctx.request.originalUrl}`,
    );
  return next();
};

export default logger;
