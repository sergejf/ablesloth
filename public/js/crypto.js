var Crypto = function () {

        var key = [],
            salt = "",
            password = "",

        cryptoError = function (x) {
            alert(x);
        },

        /* compute PBKDF2 on the password. */
        PBKDF2 = function () {
            var
                key,
                hex = sjcl.codec.hex.fromBits,
                p = {};

            p.iter = 1000; // 1000 iterations

            if (password.length == 0) {
                cryptoError("Can't do PBKDF2: need a password!");
                return;
            }
            if (salt.length == 0) {
                cryptoError("Can't do PBKDF2: need a salt!");
                return;
            }

            p.salt = salt;
            p = sjcl.misc.cachedPbkdf2(password, p);
            key = p.key.slice(0, 256 / 32);

            return key;
        },

        init = function (s, p) {
            sjcl.random.startCollectors();
            salt = s;
            password = p;
            key = PBKDF2();
        },

        initVector = function () {
            // TODO generate IV
            return [-1790621709, 41978903, 897987306, 1335599858]; // initialization vector
        },

        /* Encrypt a message */
        encrypt = function (plaintext, iv) {
            var
                adata = "", // additional plaintext data
                aes = plaintext,
                rp = {},
                ct, p;

            if (plaintext === '') {
                cryptoError("need some plaintext!");
                return;
            }
            if (key.length === 0) {
                cryptoError("need a key!");
                return;
            }

            p = {
                adata: "", // additional plaintext data
                iter: 1000, // 1000 iterations
                mode: "ccm", // ccm mode
                ts: 64, // auth strength 64 bits
                ks: 256 // key size 256 bits
            };

            p.iv = iv; // initialization vector
            p.salt = salt; // salt
            ct = sjcl.encrypt(key, plaintext, p, rp).replace(/,/g, ",\n");

            return JSON.parse(ct).ct;
        },

        /* Decrypt a message */
        decrypt = function (ciphertext, iv) {
            var
            // TODO generate IV
                adata = "", // additional plaintext data
                plaintext,
                aes,
                rp = {},
                mode = "ccm", // ccm mode
                ts = 64, // auth strength 64 bits
                ks = 256; // key size 256 bits

            if (ciphertext.length === 0) {
                cryptoError("Can't decrypt: need a ciphertext!");
                return;
            }
            if (!key.length) {
                cryptoError("Can't decrypt: need a key!");
                return;
            }

            ciphertext = sjcl.codec.base64.toBits(ciphertext);
            aes = new sjcl.cipher.aes(key);

            try {
                plaintext = sjcl.codec.utf8String.fromBits(sjcl.mode[mode].decrypt(aes, ciphertext, iv, adata, ts));
            } catch (e) {
                cryptoError("Can't decrypt: " + e);
            }

            return plaintext;
        };

    return {
        init: init,
        initVector: initVector,
        encrypt: encrypt,
        decrypt: decrypt
    };

};
