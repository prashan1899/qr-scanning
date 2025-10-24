const supabase = require('../config/database');

exports.processScan = async (req, res) => {
    const { building_id, direction, tag_id } = req.body;

    if (!building_id || !direction || !tag_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Fetch current count
        const { data: building, error: fetchError } = await supabase
            .from('BUILDING')
            .select('total_count')
            .eq('building_id', building_id)
            .single();

        if (fetchError || !building) {
            console.error('Error fetching building:', fetchError);
            return res.status(404).json({ error: 'Building not found' });
        }

        let newCount = building.total_count;
        if (direction === 'IN') {
            newCount += 1;
        } else if (direction === 'OUT') {
            newCount = Math.max(0, newCount - 1);
        } else {
            return res.status(400).json({ error: 'Invalid direction' });
        }

        // Update count
        const { error: updateError } = await supabase
            .from('BUILDING')
            .update({ total_count: newCount })
            .eq('building_id', building_id);

        if (updateError) {
            console.error('Error updating count:', updateError);
            return res.status(500).json({ error: 'Failed to process scan' });
        }

        // Insert log
        const { error: logError } = await supabase
            .from('EntryExitLog')
            .insert({ building_id, tag_id, direction });

        if (logError) {
            console.error('Error logging scan:', logError);
            return res.status(500).json({ error: 'Failed to log scan' });
        }

        res.json({
            message: `Successfully processed ${direction} scan for tag ${tag_id} at building ${building_id}`,
            building: { building_id, total_count: newCount }
        });
    } catch (error) {
        console.error('Unexpected error processing scan:', error);
        res.status(500).json({ error: 'Failed to process scan' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('EntryExitLog')
            .select('*')
            .order('entry_time', { ascending: false });

        if (error) {
            console.error('Error fetching logs:', error);
            return res.status(500).json({ error: 'Failed to fetch logs' });
        }

        res.json(data);
    } catch (error) {
        console.error('Unexpected error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
};