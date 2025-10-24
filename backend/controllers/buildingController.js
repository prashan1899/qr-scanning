const supabase = require('../config/database');

exports.getBuildings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('BUILDING')
            .select('*');
        
        if (error) {
            console.error('Error fetching buildings:', error);
            return res.status(500).json({ error: 'Failed to fetch buildings' });
        }
        
        res.json(data);
    } catch (error) {
        console.error('Unexpected error fetching buildings:', error);
        res.status(500).json({ error: 'Failed to fetch buildings' });
    }
};

exports.updateCount = async (req, res) => {
    const { building_id, direction, count } = req.body;

    if (!building_id || !direction || !count) {
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
            newCount += count;
        } else if (direction === 'OUT') {
            newCount = Math.max(0, newCount - count);
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
            return res.status(500).json({ error: 'Failed to update count' });
        }

        res.json({
            message: `Successfully updated count for building ${building_id} (${direction} by ${count})`,
            building: { building_id, total_count: newCount }
        });
    } catch (error) {
        console.error('Unexpected error updating count:', error);
        res.status(500).json({ error: 'Failed to update count' });
    }
};