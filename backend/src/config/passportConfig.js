const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

function configurePassport() {
  // Só configura GoogleStrategy se as credenciais estiverem presentes
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientID && clientSecret && clientID !== 'SEU_GOOGLE_CLIENT_ID') {
    passport.use(
      new GoogleStrategy(
        {
          clientID,
          clientSecret,
          callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('Nenhum email encontrado na conta Google.'), null);
            }

            // Busca ou cria usuário por email
            let user = await User.findOne({ email });

            if (!user) {
              // Cria um novo usuário a partir do perfil Google
              // Senha aleatória pois não será usada (login via OAuth)
              const randomPassword = `google-${Date.now()}-${Math.random().toString(36).slice(2)}`;
              user = await User.create({
                nome: profile.displayName || email.split('@')[0],
                email,
                senha: randomPassword,
                avatar: profile.photos?.[0]?.value || null,
                financeiro: { saldo: 0, diaVencimentoCartao: null, limiteCartao: 0, plano: 'gratuito' },
              });
            }

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );
  } else if (process.env.NODE_ENV !== 'test') {
    console.log('[Passport] Google OAuth desativado — GOOGLE_CLIENT_ID não configurado.');
  }

  // Serialize/Deserialize (necessários para session, mesmo sem uso direto)
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

module.exports = configurePassport;
