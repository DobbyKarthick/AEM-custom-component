<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="Spin Wheel Configuration"
          sling:resourceType="dam/cfm/models/editor/components/contentfragmentmodel"
          modelPath="/conf/wheelspin/settings/dam/cfm/models/spin-wheel-config">
    
    <elements jcr:primaryType="nt:unstructured">
        
        <!-- Title -->
        <title
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Title"
            name="title"
            required="{Boolean}true"
            defaultValue="Spin the Wheel!"
            maxLength="100"/>
        
        <!-- Button Text -->
        <buttonText
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Button Text"
            name="buttonText"
            required="{Boolean}true"
            defaultValue="SPIN"
            maxLength="50"/>
        
        <!-- Spinning Text -->
        <spinningText
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Spinning Text"
            name="spinningText"
            required="{Boolean}true"
            defaultValue="Spinning..."
            maxLength="50"/>
        
        <!-- Wheel Size -->
        <wheelSize
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Wheel Size"
            name="wheelSize"
            required="{Boolean}true"
            defaultValue="400"
            min="300"
            max="800"/>
        
        <!-- Animation Duration -->
        <animationDuration
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Animation Duration (ms)"
            name="animationDuration"
            required="{Boolean}true"
            defaultValue="4000"
            min="1000"
            max="10000"/>
        
        <!-- Min Revolutions -->
        <minRevolutions
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Minimum Revolutions"
            name="minRevolutions"
            required="{Boolean}true"
            defaultValue="5"
            min="2"
            max="15"/>
        
        <!-- Max Revolutions -->
        <maxRevolutions
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Maximum Revolutions"
            name="maxRevolutions"
            required="{Boolean}true"
            defaultValue="8"
            min="3"
            max="20"/>
        
        <!-- Variant -->
        <variant
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/dropdown"
            fieldLabel="Variant"
            name="variant"
            required="{Boolean}true"
            defaultValue="card">
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
            defaultValue="lg">
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
        
        <!-- Segments (Multi-field) -->
        <segments
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/multifield"
            fieldLabel="Wheel Segments"
            name="segments"
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
                    <color
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Color (Hex)"
                        name="color"
                        required="{Boolean}true"
                        defaultValue="#FFC300"
                        maxLength="7"/>
                    <value
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Value (Optional)"
                        name="value"
                        maxLength="100"/>
                </elements>
            </field>
        </segments>
        
    </elements>
    
</jcr:root> 