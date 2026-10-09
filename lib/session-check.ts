// Una sesión guardada en el navegador sigue "viva" aunque la cuenta se haya borrado o el token ya
// no valga: `getSession()` no le pregunta a Supabase. Estas reglas deciden cuándo una respuesta de
// `auth.getUser()` significa que hay que cerrar la sesión local.

type AuthErrorLike = { status?: number; code?: string } | null;
type GetUserResult = { data: { user: unknown | null }; error: AuthErrorLike };

const DEAD_CODES = new Set(["user_not_found", "bad_jwt", "session_not_found", "refresh_token_not_found"]);

export async function sessionIsDead(getUser: () => Promise<GetUserResult>): Promise<boolean> {
  try {
    const { data, error } = await getUser();
    if (error) {
      // Un corte de red o un error 5xx no prueba nada: no se cierra la sesión por eso.
      if (error.code && DEAD_CODES.has(error.code)) return true;
      return error.status === 401 || error.status === 403;
    }
    return data.user === null;
  } catch {
    return false;
  }
}
