
package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.JobBasedResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobBasedResponseRepository extends JpaRepository<JobBasedResponseEntity, Integer> {

    @Query(value = "SELECT * FROM tbljobbasedresponse resp WHERE resp.is_deleted = 0", nativeQuery = true)
    List<JobBasedResponseEntity> findAllResponse();

}
