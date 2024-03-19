package com.sgma.client.config;

import com.sgma.client.controllers.ClientSoapController;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;



@Configuration
@AllArgsConstructor
public class SoapConfigcfx {

    private Bus bus;
    private  ClientSoapController clientSoapController;
    @Bean
    public EndpointImpl clientServiceEndpoint() throws Exception {
        EndpointImpl endpoint = new EndpointImpl(bus, clientSoapController);
        endpoint.publish("/ClientService");
        return endpoint;
    }
}