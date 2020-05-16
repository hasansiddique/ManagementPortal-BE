const asyncHandler = fn => (ctx, next) =>
  Promise.resolve(fn(ctx, next)).catch(ctx);

export default asyncHandler;

