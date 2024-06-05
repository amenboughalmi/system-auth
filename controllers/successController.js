exports.authSuccess = (req, res) => {
    const token = req.query.token;
    res.json({ message: 'Authentication successful', token });
  };
  