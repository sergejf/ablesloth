function loaded() {
    sjcl.random.startCollectors();
}

/* there's probaby a better way to tell the user something, but oh well */
function error(x) {
    alert(x);
}

/* compute PBKDF2 on the password. */
function doPbkdf2(salt, password) {
    var
        key, hex = sjcl.codec.hex.fromBits,
        p = {};

    p.iter = 1000; // 1000 iterations

    if (password.length == 0) {
        error("Can't do PBKDF2: need a password!");
        return;
    }

    if (salt.length === 0) {
        error("Can't do PBKDF2: need a salt!");
        return;
    }

    p.salt = salt;

    p = sjcl.misc.cachedPbkdf2(password, p);
    key = p.key.slice(0, 256 / 32);

    return key;
}

/* Encrypt a message */
function doEncrypt(salt, plaintext, key) {
    var
        // TODO generate IV
        iv = [-1790621709, 41978903, 897987306, 1335599858], // initialization vector
        adata = "", // additional plaintext data
        aes = plaintext,
        rp = {},
        ct, p;

    if (plaintext === '') {
        error("need some plaintext!");
        return;
    }
    if (key.length == 0) {
        error("need a key!");
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

    return ct;
}

/* Decrypt a message */
function doDecrypt(ciphertext, key) {
    var
        // TODO generate IV
        iv = [-1790621709, 41978903, 897987306, 1335599858], // initialization vector
        adata = "", // additional plaintext data
        plaintext,
        aes,
        rp = {},
        mode = "ccm", // ccm mode
        ts = 64, // auth strength 64 bits
        ks = 256; // key size 256 bits

    if (ciphertext.length === 0) {
        error("Can't decrypt: need a ciphertext!");
        return;
    }

    if (!key.length) {
        error("Can't decrypt: need a key!");
        return;
    }

    /* it's raw */
    ciphertext = sjcl.codec.base64.toBits(ciphertext);
    aes = new sjcl.cipher.aes(key);

    try {
        plaintext = sjcl.codec.utf8String.fromBits(sjcl.mode[mode].decrypt(aes, ciphertext, iv, adata, ts));
    } catch (e) {
        error("Can't decrypt: " + e);
    }

    return plaintext;
}


