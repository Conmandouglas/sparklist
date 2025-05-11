import { Strategy as LocalStrategy } from 'passport-local';
import pool from './db.js';
import bcrypt from 'bcrypt';

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = userQuery.rows[0];

      if (!user) return done(null, false, { message: "No user with that email" });

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.user_id));
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });
}

export default initialize;
