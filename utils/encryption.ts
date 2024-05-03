import nacl from 'tweetnacl'
import naclUtil from 'tweetnacl-util'
import ed2curve from 'ed2curve'

export function encryptMessageSecretBox(message: string, key: string) {
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const messageUint8 = naclUtil.decodeUTF8(message);
    const box = nacl.secretbox(messageUint8, nonce, Buffer.from(key, 'hex'));

    const fullMessage = new Uint8Array(nonce.length + box.length);
    fullMessage.set(nonce);
    fullMessage.set(box, nonce.length);

    return naclUtil.encodeBase64(fullMessage);
}


export function decryptMessageSecretBox(messageWithNonce: string, key: string) {
    const fullMessage = naclUtil.decodeBase64(messageWithNonce);
    const nonce = fullMessage.slice(0, nacl.secretbox.nonceLength);
    const message = fullMessage.slice(nacl.secretbox.nonceLength);

    const decrypted = nacl.secretbox.open(message, nonce, Buffer.from(key, 'hex'));

    if (!decrypted) {
        throw new Error('Could not decrypt message');
    }

    return naclUtil.encodeUTF8(decrypted);
}

export function _generateSharedSecret(pubkey: string, privkey: string) {

    const myPrivateKey = ed2curve.convertSecretKey(Buffer.from(privkey, 'hex'))
    const theirPublicKey = ed2curve.convertPublicKey(Buffer.from(pubkey, 'hex'))

    if (!myPrivateKey || !theirPublicKey) {
        throw new Error("Unable to generate shared secret")
    }

    // Compute the shared secret using your private key and your friend's public key
    const sharedSecret = nacl.scalarMult(myPrivateKey, theirPublicKey)

    return Buffer.from(sharedSecret).toString('hex') // This shared secret can be used to encrypt messages
}