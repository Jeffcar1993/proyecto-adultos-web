import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
  const baseUrl = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '');
  const resetLink = `${baseUrl}/recuperar-contrase%C3%B1a?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: 'Soporte <onboarding@resend.dev>',
    to: email,
    subject: 'Recupera tu contraseña - Erotik Colombia',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: #09090b; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -1px; margin: 0;">
            Erotik Colombia
          </h1>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #09090b; font-size: 20px; font-weight: 800; margin-top: 0;">
            Restablecer contraseña
          </h2>
          <p style="color: #52525b; line-height: 1.6;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            Haz clic en el siguiente botón para continuar.
          </p>
          <p style="color: #ef4444; font-size: 13px; font-weight: 700;">
            ⚠ Este enlace expira en 15 minutos.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}"
               style="background: #2563eb; color: #ffffff; padding: 14px 32px; text-decoration: none;
                      border-radius: 10px; display: inline-block; font-weight: 700; font-size: 15px;">
              Restablecer Contraseña
            </a>
          </div>
          <p style="color: #a1a1aa; font-size: 12px; margin-top: 24px;">
            Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no cambiará.
          </p>
          <hr style="border: none; border-top: 1px solid #f4f4f5; margin: 24px 0;" />
          <p style="color: #d4d4d8; font-size: 11px; text-align: center;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
            <span style="color: #2563eb; word-break: break-all;">${resetLink}</span>
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('[Resend] Error al enviar correo:', JSON.stringify(error));
    throw new Error(`No se pudo enviar el correo: ${error.message}`);
  }
};
