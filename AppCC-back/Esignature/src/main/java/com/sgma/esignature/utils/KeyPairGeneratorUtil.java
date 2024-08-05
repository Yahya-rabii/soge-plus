package com.sgma.esignature.utils;

import java.security.*;

public class KeyPairGeneratorUtil {    private KeyPair keyPair;    public KeyPairGeneratorUtil() throws NoSuchAlgorithmException {
    KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
    keyGen.initialize(2048);
    this.keyPair = keyGen.generateKeyPair();
}    public PrivateKey getPrivateKey() {
    return keyPair.getPrivate();
}    public PublicKey getPublicKey() {
    return keyPair.getPublic();
}    public static void main(String[] args) throws NoSuchAlgorithmException {
    KeyPairGeneratorUtil keyPairGenUtil = new KeyPairGeneratorUtil();
    System.out.println("Private Key: " + keyPairGenUtil.getPrivateKey());
    System.out.println("Public Key: " + keyPairGenUtil.getPublicKey());
}
}