const mongoose = require('mongoose');

/* const migration_N_Sample = async () => {
    console.log('Applying migration script "samigration_N_Samplemple"...');
}; */

const migration_1_ModulesNewPackageDependencies = async () => {
    console.log('Applying migration script "migration_1_ModulesNewPackageDependencies"...');
    for (const mod of (await mongoose.connection.collection('modules').find({}))) {
        const packageDependencies = {
            api   : {},
            theme : {}
        };
        if (mod.packageDependencies) {
            for (const apiOrTheme of Object.keys(mod.packageDependencies)) {
                if (Array.isArray(mod.packageDependencies[apiOrTheme])) {
                    for (const value of mod.packageDependencies[apiOrTheme]) {
                        const dependencyValue = value.split('@');
                        if (dependencyValue[0] === '') {
                            dependencyValue.splice(0, 1);
                            dependencyValue[0] = `@${dependencyValue[0]}`;
                        }
                        packageDependencies[apiOrTheme][dependencyValue[0]] = dependencyValue[1] || 'latest';
                    }
                } else {
                    packageDependencies[apiOrTheme] = mod.packageDependencies[apiOrTheme];
                }
            }
            await mongoose.connection.collection('modules').updateOne({_id: mod._id}, {
                $set : {
                    packageDependencies
                }
            });
        }
    }
};

const migration_2_Metrics = async () => {
    console.log('Applying migration script "migration_2_Metrics"...');
    const config = await mongoose.connection.collection('configuration').findOne({});
    if (config && config.environment) {
        await mongoose.connection.collection('configuration').updateOne({}, {$unset: {'environment.sendMetrics': {}}});
    }
};

/* const migration_3_CreatedAt = async () => {
    console.log('Applying migration script "migration_2_CreatedAt"...');
    // TODO
}; */

// Scripts must be in order: put the new scripts at the bottom
const migrationScripts = [
    migration_1_ModulesNewPackageDependencies,
    migration_2_Metrics
    // migration_3_CreatedAt
    // sample
];

module.exports = {
    migrationScripts
};