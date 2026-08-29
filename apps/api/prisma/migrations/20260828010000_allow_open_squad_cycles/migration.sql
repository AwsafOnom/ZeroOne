CREATE OR REPLACE FUNCTION enforce_recovery_cycle_squad_size()
RETURNS TRIGGER AS $$
DECLARE
  required_size INTEGER;
  member_count INTEGER;
BEGIN
  SELECT max_squad_members INTO required_size
  FROM "platform_configs"
  WHERE id = 'default';
  IF required_size IS NULL THEN
    RAISE EXCEPTION 'Default platform configuration is missing';
  END IF;
  SELECT COUNT(*) INTO member_count
  FROM "squad_memberships"
  WHERE squad_id = NEW.squad_id
    AND status IN ('INVITED', 'ACTIVE', 'PAUSED');
  IF member_count > required_size THEN
    RAISE EXCEPTION 'A recovery cycle cannot exceed the configured squad size';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
