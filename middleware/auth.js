module.exports = {
    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            return next(); // Akses diizinkan, lanjutkan ke rute berikutnya
        }
        return res.redirect('/loginPage'); // Akses ditolak, redirect ke halaman login
    }, isAlumni: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'alumni') {
            return next(); // Akses diizinkan, lanjutkan ke rute berikutnya
        }
        return res.redirect('/loginPage'); // Akses ditolak, redirect ke halaman login
    }
}