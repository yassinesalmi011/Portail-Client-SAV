package com.aebdm.savclient.repository.specs;

import com.aebdm.savclient.entity.Ticket;
import com.aebdm.savclient.entity.User;
import com.aebdm.savclient.enums.StatutTicket;
import org.springframework.data.jpa.domain.Specification;

public final class TicketSpecifications {

    public static Specification<Ticket> hasTechnician(User technicien) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("technicien"), technicien);
    }

    public static Specification<Ticket> hasClient(User client) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("client"), client);
    }

    public static Specification<Ticket> hasStatus(StatutTicket statut) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("statut"), statut);
    }

    public static Specification<Ticket> containsSearchTerm(String searchTerm) {
        String lowerCaseSearchTerm = "%" + searchTerm.toLowerCase() + "%";
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("titre")), lowerCaseSearchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), lowerCaseSearchTerm)
                );
    }
}