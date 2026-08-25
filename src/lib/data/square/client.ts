import "server-only";
import { SquareClient, SquareEnvironment } from "square";
import { accessTokenSquare, environnementSquare, squareEstConfigure } from "./config";

let instance: SquareClient | null = null;

/** Client Square singleton (jeton uniquement côté serveur). */
export function getSquareClient(): SquareClient {
  if (!squareEstConfigure()) {
    throw new Error(
      "Square n'est pas configuré : définir SQUARE_ACCESS_TOKEN et SQUARE_LOCATION_ID.",
    );
  }
  if (!instance) {
    instance = new SquareClient({
      token: accessTokenSquare()!,
      environment:
        environnementSquare() === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
      timeoutInSeconds: 15,
    });
  }
  return instance;
}
