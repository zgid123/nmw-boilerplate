import { genSalt, hashSync } from 'bcrypt';

interface IBcryptParams {
  salt?: string;
  source: string;
}

interface IRBcryptHashProps {
  salt: string;
  hash: string;
}

export function generateSalt(characterNumber = 10): Promise<string> {
  return genSalt(characterNumber);
}

export async function bcryptHash({
  salt,
  source,
}: IBcryptParams): Promise<IRBcryptHashProps> {
  salt = salt || (await generateSalt());

  return {
    salt,
    hash: hashSync(source, salt),
  };
}
