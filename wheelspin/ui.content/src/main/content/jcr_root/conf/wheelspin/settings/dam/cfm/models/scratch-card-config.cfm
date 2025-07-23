<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="Scratch Card Configuration"
          sling:resourceType="dam/cfm/models/editor/components/contentfragmentmodel"
          modelPath="/conf/wheelspin/settings/dam/cfm/models/scratch-card-config">
    
    <elements jcr:primaryType="nt:unstructured">
        
        <!-- Title -->
        <title
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Title"
            name="title"
            required="{Boolean}true"
            defaultValue="Scratch Card"
            maxLength="100"/>
        
        <!-- Instructions -->
        <instructions
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Instructions"
            name="instructions"
            required="{Boolean}true"
            defaultValue="Scratch the surface to reveal your prize!"
            maxLength="200"/>
        
        <!-- Card Width -->
        <cardWidth
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Card Width (px)"
            name="cardWidth"
            required="{Boolean}true"
            defaultValue="300"
            min="200"
            max="800"/>
        
        <!-- Card Height -->
        <cardHeight
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Card Height (px)"
            name="cardHeight"
            required="{Boolean}true"
            defaultValue="200"
            min="150"
            max="600"/>
        
        <!-- Brush Radius -->
        <brushRadius
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Brush Radius (px)"
            name="brushRadius"
            required="{Boolean}true"
            defaultValue="20"
            min="5"
            max="50"/>
        
        <!-- Scratch Color -->
        <scratchColor
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Scratch Color (Hex)"
            name="scratchColor"
            required="{Boolean}true"
            defaultValue="#c0c0c0"
            maxLength="7"/>
        
        <!-- Scratch Pattern -->
        <scratchPattern
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Scratch Pattern Text"
            name="scratchPattern"
            required="{Boolean}true"
            defaultValue="Scratch to reveal your prize!"
            maxLength="100"/>
        
        <!-- Reveal Threshold -->
        <revealThreshold
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Reveal Threshold (%)"
            name="revealThreshold"
            required="{Boolean}true"
            defaultValue="60"
            min="10"
            max="90"/>
        
        <!-- Reset Button Text -->
        <resetButtonText
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Reset Button Text"
            name="resetButtonText"
            required="{Boolean}true"
            defaultValue="Play Again"
            maxLength="50"/>
        
        <!-- Variant -->
        <variant
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/dropdown"
            fieldLabel="Variant"
            name="variant"
            required="{Boolean}true"
            defaultValue="default">
            <options jcr:primaryType="nt:unstructured">
                <default
                    jcr:primaryType="nt:unstructured"
                    text="Default"
                    value="default"/>
                <card
                    jcr:primaryType="nt:unstructured"
                    text="Card"
                    value="card"/>
                <minimal
                    jcr:primaryType="nt:unstructured"
                    text="Minimal"
                    value="minimal"/>
            </options>
        </variant>
        
        <!-- Size -->
        <size
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/dropdown"
            fieldLabel="Size"
            name="size"
            required="{Boolean}true"
            defaultValue="default">
            <options jcr:primaryType="nt:unstructured">
                <sm
                    jcr:primaryType="nt:unstructured"
                    text="Small"
                    value="sm"/>
                <default
                    jcr:primaryType="nt:unstructured"
                    text="Default"
                    value="default"/>
                <lg
                    jcr:primaryType="nt:unstructured"
                    text="Large"
                    value="lg"/>
                <xl
                    jcr:primaryType="nt:unstructured"
                    text="Extra Large"
                    value="xl"/>
            </options>
        </size>
        
        <!-- Prizes (Multi-field) -->
        <prizes
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/multifield"
            fieldLabel="Prizes"
            name="prizes"
            required="{Boolean}true">
            <field
                jcr:primaryType="nt:unstructured"
                sling:resourceType="dam/cfm/models/editor/components/datatypes/group">
                <elements jcr:primaryType="nt:unstructured">
                    <text
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Text"
                        name="text"
                        required="{Boolean}true"
                        maxLength="50"/>
                    <value
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Value"
                        name="value"
                        maxLength="100"/>
                    <color
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Color (Hex)"
                        name="color"
                        defaultValue="#3b82f6"
                        maxLength="7"/>
                    <icon
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Icon (Emoji)"
                        name="icon"
                        defaultValue="🎁"
                        maxLength="10"/>
                </elements>
            </field>
        </prizes>
        
    </elements>
    
</jcr:root> 