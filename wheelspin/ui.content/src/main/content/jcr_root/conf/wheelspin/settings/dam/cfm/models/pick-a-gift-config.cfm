<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" 
          xmlns:jcr="http://www.jcp.org/jcr/1.0" 
          xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="Pick-a-Gift Configuration"
          sling:resourceType="dam/cfm/models/editor/components/contentfragmentmodel"
          modelPath="/conf/wheelspin/settings/dam/cfm/models/pick-a-gift-config">
    
    <elements jcr:primaryType="nt:unstructured">
        
        <!-- Title -->
        <title
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Title"
            name="title"
            required="{Boolean}true"
            defaultValue="Pick a gift!"
            maxLength="100"/>
        
        <!-- Subtitle -->
        <subtitle
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
            fieldLabel="Subtitle"
            name="subtitle"
            required="{Boolean}false"
            defaultValue="Pick one of the gift boxes to reveal your prize"
            maxLength="200"/>
        
        <!-- Auto Open -->
        <autoOpen
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/checkbox"
            fieldLabel="Auto Open"
            name="autoOpen"
            required="{Boolean}true"
            defaultValue="false"/>
        
        <!-- Show Close Button -->
        <showCloseButton
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/checkbox"
            fieldLabel="Show Close Button"
            name="showCloseButton"
            required="{Boolean}true"
            defaultValue="true"/>
        
        <!-- Animation Duration -->
        <animationDuration
            jcr:primaryType="nt:unstructured"
            sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
            fieldLabel="Animation Duration (ms)"
            name="animationDuration"
            required="{Boolean}true"
            defaultValue="1000"
            min="500"
            max="5000"/>
        
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
                        defaultValue="#e74c3c"
                        maxLength="7"/>
                    <icon
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/textfield"
                        fieldLabel="Icon (Emoji)"
                        name="icon"
                        defaultValue="🎯"
                        maxLength="10"/>
                    <probability
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="dam/cfm/models/editor/components/datatypes/numberfield"
                        fieldLabel="Probability (0-1)"
                        name="probability"
                        defaultValue="0.15"
                        min="0"
                        max="1"/>
                </elements>
            </field>
        </prizes>
        
    </elements>
    
</jcr:root> 