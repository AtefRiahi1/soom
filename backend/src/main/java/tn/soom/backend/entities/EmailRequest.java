package tn.soom.backend.entities;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@ToString
public class EmailRequest {
    private List<String> to;
    private String subject;
    private String text;
}
