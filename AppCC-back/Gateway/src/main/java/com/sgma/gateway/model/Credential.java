package com.sgma.gateway.model;

import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
public class Credential {
    private String type;
    private String value;
    private boolean temporary;

    public Credential(String type, String value) {
        this.type = type;
        this.value = value;
        this.temporary = false;
    }
}