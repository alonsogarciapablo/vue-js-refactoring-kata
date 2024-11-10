export default function encrypt(password: string): string {
  return btoa(password)
}
