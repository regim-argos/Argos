module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.sequelize.query(
        'CREATE INDEX index_watcher_notification_id ON watchers USING gin (notifications);'
      ),
      queryInterface.sequelize.query(
        `
        CREATE FUNCTION trg_d_notifications() RETURNS TRIGGER AS $f$
        BEGIN
        update watchers p
          set notifications = COALESCE ((
              select  jsonb_agg(value)
              from watchers ps,
              jsonb_array_elements(notifications)
              where ps.id = p.id      -- important! primary key to identify a row
              and value->>'id' <> OLD.id::varchar(255)), '[]')
              where notifications != '[]' ;
              RETURN OLD; 
        END
        $f$ LANGUAGE plpgsql;

        CREATE TRIGGER trg_d_notifications BEFORE DELETE ON notifications FOR EACH ROW EXECUTE PROCEDURE trg_d_notifications()
        `
      ),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.sequelize.query(
        'DROP INDEX index_watcher_notification_id;'
      ),
      queryInterface.sequelize.query(
        `
        DROP TRIGGER trg_d_notifications ON notifications;
        `
      ),
      queryInterface.sequelize.query(
        `
        DROP FUNCTION trg_d_notifications;
        `
      ),
    ]);
  },
};
