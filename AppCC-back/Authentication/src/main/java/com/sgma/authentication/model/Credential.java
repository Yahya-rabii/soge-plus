package com.sgma.authentication.model;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Credential {

    private String type="password";
    private String value;
    private boolean temporary;
    public Credential(String value) {
        this.value = value;
        this.temporary = false;
    }

}