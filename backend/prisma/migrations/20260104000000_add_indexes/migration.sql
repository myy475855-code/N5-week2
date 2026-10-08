-- CreateIndex (filter internships by location)
CREATE INDEX "internships_location_idx" ON "internships"("location");

-- CreateIndex (filter applications by status)
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex (list applications for an internship)
CREATE INDEX "applications_internship_id_idx" ON "applications"("internship_id");
