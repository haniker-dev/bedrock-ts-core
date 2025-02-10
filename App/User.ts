import * as JD from "decoders"
import { Email, emailDecoder } from "../Data/User/Email"
import { Name, nameDecoder } from "../Data/User/Name"

/** Provided as an example for App-level Type 1
 * User type differs from app to app
 * so it cannot belong to Data context-folder
 */
export type User = {
  name: Name
  email: Email
}

export const userDecoder: JD.Decoder<User> = JD.object({
  name: nameDecoder,
  email: emailDecoder,
})
