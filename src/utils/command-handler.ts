export type CommandHandler<HandlerInput, HandlerOutput> = {
  execute: (input: HandlerInput) => Promise<HandlerOutput>
}